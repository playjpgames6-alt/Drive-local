// This file provides basic type definitions for the Google API Client Library (gapi)
// and Google Identity Services (GIS) which are loaded from script tags.

// Fix: Add missing gapi.load definition and correct gapi namespace structure.
declare namespace gapi {
  function load(api: string, callback: () => void): void;

  namespace client {
    function init(args: any): Promise<void>;
    function request(args: any): Promise<any>;
    const drive: any; // Simplified type for the drive API
    function getToken(): any;
    function setToken(token: any): void;
  }
}

declare namespace google.accounts.oauth2 {
  function initTokenClient(config: TokenClientConfig): TokenClient;
  function revoke(token: string, callback: () => void): void;

  interface TokenClient {
    requestAccessToken(overrideConfig?: any): void;
  }

  interface TokenClientConfig {
    client_id: string;
    scope: string;
    callback: (response: TokenResponse) => void;
  }

  interface TokenResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    error?: string;
  }
}
