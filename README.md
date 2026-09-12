# PulseDrop

> A real-time delivery tracking platform built with Java, Spring Boot, Microservices, Kafka, Redis, WebSocket/STOMP, MySQL, and React.

PulseDrop is a practical microservices-based delivery tracking system inspired by real-world delivery and ride-tracking workflows.

The project demonstrates how multiple backend services communicate through REST APIs and Kafka events while Redis handles real-time driver location and availability data. Customers can track delivery status and driver location in real time through a React frontend.

---

## Overview

PulseDrop follows an event-driven microservices architecture.

The system supports two primary users:

- Customer
- Driver

A customer can create a delivery order and track its progress.

A driver can:

- Manage availability
- Share live location
- View assigned orders
- Update delivery status

When an order is created, the system uses Kafka to trigger driver assignment. Redis GEO data is used to find a nearby available driver.

Real-time updates are delivered to the frontend using WebSocket/STOMP.

---

## Key Features

### Customer

- Register and login
- JWT-based authentication
- Create delivery orders
- View personal orders
- View order details
- Track order status
- Track assigned driver's live location
- Receive real-time notifications

### Driver

- Register and login
- JWT-based authentication
- Set availability
- Persist availability state
- Share live location
- View assigned orders
- Update delivery status
- Receive order-related updates

### Platform

- Microservices architecture
- API Gateway
- JWT authentication
- Role-based authorization
- Kafka event-driven communication
- Redis GEO-based driver discovery
- Real-time WebSocket/STOMP communication
- MySQL persistence
- React frontend
- Interactive live tracking map

---

# Architecture

```text
                         ┌─────────────────────┐
                         │      React UI        │
                         │                     │
                         │ Customer / Driver   │
                         └──────────┬──────────┘
                                    │
                         REST / WebSocket
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    API Gateway      │
                         │       :8080         │
                         │                     │
                         │ JWT Validation      │
                         │ Routing             │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
      │ User Service│       │Order Service│       │   Driver    │
      │    :8081    │       │    :8082    │       │ Assignment  │
      │             │       │             │       │    :8083    │
      │ JWT / Users │       │ Orders      │       │ Redis GEO   │
      └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
             │                     │                      │
             ▼                     ▼                      ▼
       ┌──────────┐          ┌──────────┐           ┌──────────┐
       │  MySQL   │          │  MySQL   │           │  Redis   │
       └──────────┘          └──────────┘           └──────────┘

                              Kafka
                        ┌─────────────────┐
                        │ pulse.order.    │
                        │ events          │
                        └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
           Driver Assignment          Notification
              Service                    Service
                                         :8085
                                            │
                                            ▼
                                      WebSocket
                                            │
                                            ▼
                                         React


          Location Service :8084
                    │
                    ├── Redis GEO
                    │
                    └── WebSocket/STOMP
                              │
                              ▼
                         React Map
