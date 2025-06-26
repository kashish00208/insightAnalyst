package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

func main() {
	// Initialize Firebase App once
	ctx := context.Background()
	opt := option.WithCredentialsFile("serviceAccountKey.json")
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	// Use closure to pass the app to handler
	http.HandleFunc("/secure", func(w http.ResponseWriter, r *http.Request) {
		secureHandler(w, r, app)
	})

	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func secureHandler(w http.ResponseWriter, r *http.Request, app *firebase.App) {
	ctx := context.Background()

	// Extract token from Authorization header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header missing", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		http.Error(w, "Invalid Authorization header format", http.StatusUnauthorized)
		return
	}

	idToken := parts[1]

	// Get Firebase Auth client
	client, err := app.Auth(ctx)
	if err != nil {
		http.Error(w, "Error initializing Auth client", http.StatusInternalServerError)
		return
	}

	// Verify ID Token
	token, err := client.VerifyIDToken(ctx, idToken)
	if err != nil {
		http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
		return
	}

	// Valid token
	fmt.Fprintf(w, "Token is valid! UID: %s", token.UID)
}
