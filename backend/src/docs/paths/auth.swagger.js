// Swagger definitions for authentication-related APIs
module.exports = {

  // User Registration API
  "/api/v1/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              // Required fields for registration
              required: ["name", "email", "password", "role"],
              properties: {
                // User full name
                name: {
                  type: "string",
                  example: "Ayushmaan Gupta"
                },
                // User email address
                email: {
                  type: "string",
                  format: "email",
                  example: "ayush@example.com"
                },
                // User account password
                password: {
                  type: "string",
                  minLength: 8,
                  example: "StrongPass123"
                },
                // Role assigned to the user
                role: {
                  type: "string",
                  enum: ["user", "admin"],
                  example: "user"
                }
              }
            }
          }
        }
      },
      responses: {
        // Successful registration response
        201: {
          description: "User registered successfully",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "User registered successfully"
              }
            }
          }
        },
        // Validation failure
        400: {
          description: "Validation error"
        },
        // Duplicate user
        409: {
          description: "User already exists"
        }
      }
    }
  },


// -------------------------------------------------------------------------------------------


  // User Login API
  "/api/v1/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              // Required login credentials
              required: ["email", "password", "role"],
              properties: {
                // Registered email
                email: {
                  type: "string",
                  format: "email",
                  example: "abc@example.com"
                },
                // Account password
                password: {
                  type: "string",
                  example: "StrongPass123"
                },
                // Role used during login
                role: {
                  type: "string",
                  enum: ["user", "admin"],
                  example: "user"
                }
              }
            }
          }
        }
      },
      responses: {
        // Successful login response
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "Login successful",
                user: {
                  id: "65b123abc456def789012345",
                  name: "Ayushmaan Gupta",
                  email: "ayush@example.com",
                  role: "user"
                }
              }
            }
          }
        },
        // Missing required fields
        400: {
          description: "Missing credentials"
        },
        // Invalid email or password
        401: {
          description: "Invalid credentials"
        },
        // Role does not match user role
        403: {
          description: "Role mismatch"
        }
      }
    }
  }
};
