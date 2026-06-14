package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"time"
)

type SystemMetrics struct {
	Timestamp string  `json:"timestamp"`
	CpuUsage  float64 `json:"cpu_usage"`
	RamUsage  float64 `json:"ram_usage"`
	NetLatency int     `json:"net_latency_ms"`
	DiskStatus string  `json:"disk_status"`
}

type MetricsCollector struct {
	hub *Hub
}

func NewMetricsCollector(h *Hub) *MetricsCollector {
	return &MetricsCollector{hub: h}
}

func (mc *MetricsCollector) StartBroadcasting() {
	ticker := time.NewTicker(5 * time.Second)
	go func() {
		for range ticker.C {
			metrics := SystemMetrics{
				Timestamp:  time.Now().Format(time.RFC3339),
				CpuUsage:   rand.Float64()*30.0 + 5.0, // mock usage 5-35%
				RamUsage:   rand.Float64()*15.0 + 40.0, // mock usage 40-55%
				NetLatency: rand.Intn(45) + 5,
				DiskStatus: "OK",
			}

			payload, err := json.Marshal(metrics)
			if err == nil {
				fmt.Printf("[Go Hub Metrics] Broadcasting system diagnostics state: %s\n", string(payload))
				mc.hub.broadcast <- payload
			}
		}
	}()
}
