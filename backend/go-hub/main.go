package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	hub := NewHub()
	go hub.Run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ServeWs(hub, w, r)
	})

	fmt.Println("[Go Hub] WebSocket routing server started on port 19500...")
	log.Fatal(http.ListenAndServe(":19500", nil))
}