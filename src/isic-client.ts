import OauthClient from '@girder/oauth-client';

export default class IsicClient extends OauthClient {
  protected readonly isicBaseUrl: string;

  constructor(
    clientId: string,
    isicBaseUrl = 'https://api.isic-archive.com',
  ) {
    const trimmedIsicBaseUrl = isicBaseUrl.replace(/\/$/, '');
    super(`${trimmedIsicBaseUrl}/oauth/`, clientId);
    this.isicBaseUrl = trimmedIsicBaseUrl;
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
    const resp = await fetch(`${this.isicBaseUrl}/${canonicalEndpoint}`, {
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
