package service

import (
	"fmt"

	"com.xeubiart/app/domains/gallery/models"
	"com.xeubiart/app/router"
)

type GalleryService struct {
	apiURL     string
	httpClient *router.HTTPClient
}

func New(apiURL string, httpClient *router.HTTPClient) *GalleryService {
	return &GalleryService{
		apiURL:     apiURL,
		httpClient: httpClient,
	}
}

func (s *GalleryService) GetGallery(page int) (*models.GalleryResponse, error) {
	resp := models.GalleryResponse{}

	err := s.httpClient.Get(
		fmt.Sprintf("%s/api/works?page=%d&size=12", s.apiURL, page),
		&resp,
	)

	if err != nil {
		return nil, err
	}

	return &resp, nil
}
