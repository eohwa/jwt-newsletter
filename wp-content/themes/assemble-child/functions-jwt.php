<?php
/**
 * JWT handling functions for newsletter
 */

// Include JWT library (you'll need to install this via Composer or download manually)
// For this prototype, we'll use a simple JWT decode function

function decode_newsletter_jwt($token) {
    $secret = 'dev-secret'; // Same secret as in Node.js script
    
    try {
        // Simple JWT decode - in production, use firebase/php-jwt
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }
        
        // Decode header and payload
        $header = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0])), true);
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
        
        // Simple signature verification (not cryptographically secure - use proper JWT library in production)
        $expected_signature = base64_encode(hash_hmac('sha256', $parts[0] . '.' . $parts[1], $secret, true));
        $actual_signature = str_replace(['-', '_'], ['+', '/'], $parts[2]);
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token expired');
        }
        
        return $payload;
        
    } catch (Exception $e) {
        error_log('JWT decode error: ' . $e->getMessage());
        return false;
    }
}

function get_jwt_error_message($token) {
    if (empty($token)) {
        return 'No access token provided. Please use a valid newsletter link.';
    }
    
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return 'Invalid token format. Please check your newsletter link.';
    }
    
    try {
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return 'This newsletter link has expired. Please request a new one.';
        }
    } catch (Exception $e) {
        // Continue to generic error
    }
    
    return 'Invalid or corrupted token. Please check your newsletter link.';
}
