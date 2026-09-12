package router

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type HTTPClient struct {
	Client *http.Client
}

func New(httpClient *http.Client) *HTTPClient {
	return &HTTPClient{
		Client: httpClient,
	}
}

func (c *HTTPClient) Get(url string, decoder any) error {
	resp, err := c.Client.Get(url)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("request failed with status %d", resp.StatusCode)
	}

	if err := json.NewDecoder(resp.Body).Decode(decoder); err != nil {
		return fmt.Errorf("failed to decode response: %w", err)
	}

	return nil
}
