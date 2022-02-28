import OauthClient from '@girder/oauth-client';

export interface IsicClientOptions {
  isicOrigin?: URL;
  scopes?: string[];
}

export default class IsicClient extends OauthClient {
  protected readonly isicOrigin: URL;

  constructor(
    clientId: string,
    {
      isicOrigin = new URL('https://api.isic-archive.com'),
      scopes = [],
    }: IsicClientOptions = {},
  ) {
    const cleanedIsicOrigin = new URL(isicOrigin);
    // Origin cannot have path, query string, or fragment components
    cleanedIsicOrigin.pathname = '';
    cleanedIsicOrigin.search = '';
    cleanedIsicOrigin.hash = '';

    super(
      new URL(`${cleanedIsicOrigin}/oauth/`),
      clientId,
      {
        scopes,
      },
    );
    this.isicOrigin = cleanedIsicOrigin;
  }

  protected get fetchOptions(): RequestInit {
    return {
      headers: this.authHeaders,
      mode: 'cors',
      credentials: 'omit',
    };
  }

  public async fetchJson<T>(endpoint: string, method = 'GET'): Promise<T> {
    const canonicalEndpoint = endpoint
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .concat('/');
    const resp = await fetch(`${this.isicOrigin}/${canonicalEndpoint}`, {
      ...this.fetchOptions,
      method,
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Request error: ${resp.status}: ${text}`);
    }
    return resp.json();
  }

  public async getLegacyToken(): Promise<string> {
    interface LegacyTokenResponse {
      token: string;
    }
    const resp = await this.fetchJson<LegacyTokenResponse>('api/v2/token/legacy', 'POST');
    return resp.token;
  }
}
