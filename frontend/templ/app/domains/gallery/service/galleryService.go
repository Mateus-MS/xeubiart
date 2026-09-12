package service

import (
	"com.xeubiart/app/domains/gallery/models"
	"com.xeubiart/app/router"
)

type GalleryService struct {
	httpClient *router.HTTPClient
}

func New(httpClient *router.HTTPClient) *GalleryService {
	return &GalleryService{
		httpClient: httpClient,
	}
}

func (s *GalleryService) GetGallery() (*models.GalleryResponse, error) {
	resp := models.GalleryResponse{}

	err := s.httpClient.Get(
		"http://localhost:8080/api/works",
		&resp,
	)

	if err != nil {
		return nil, err
	}

	return &resp, nil
}
