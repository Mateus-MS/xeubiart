package utils

import (
	"strings"
	"unicode"
)

func ConvertStyleString(enumName string) string {
	words := strings.Split(enumName, "_")
	for i, word := range words {
		if len(word) == 0 {
			continue
		}
		// Capitalize first character, lowercase the rest
		words[i] = string(unicode.ToUpper(rune(word[0]))) + strings.ToLower(word[1:])
	}
	return strings.Join(words, " ")
}
