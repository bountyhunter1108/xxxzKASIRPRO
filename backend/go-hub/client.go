package main

import (
	"log"
	"net/http"
	"time"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

type Client struct {
	hub  *Hub
	id   string
	send chan []byte
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c.id
	}()

	// In real implementation, read from websocket:
	// c.conn.SetReadLimit(maxMessageSize)
	// c.conn.SetReadDeadline(time.Now().Add(pongWait))
	// c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		// Simulate reading messages from network
		time.Sleep(10 * time.Second)
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				// The hub closed the channel
				return
			}
			log.Printf("[Go Client %s] Received data queue payload: %s", c.id, string(message))
		case <-ticker.C:
			// Send ping periodic message to keep websocket connection alive
		}
	}
}

func ServeWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	// Upgrade local HTTP request to Websocket
	clientID := r.URL.Query().Get("clientId")
	if clientID == "" {
		clientID = "client_" + time.Now().Format("20060102150405")
	}

	client := &Client{hub: hub, id: clientID, send: make(chan []byte, 256)}
	client.hub.register <- client.id

	go client.writePump()
	go client.readPump()
}
