package models

type GalleryItem struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Style       string   `json:"style"`
	Description string   `json:"description"`
	PhotoURLs   []string `json:"photosURLs"`
}

type GalleryResponse struct {
	Content []GalleryItem `json:"content"`
}
