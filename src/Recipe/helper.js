import validator from 'validator';

// alphanumeric string validation
export function isAlphaNumericWithSpaces(str) {
    return /^[a-zA-Z0-9\s]+$/.test(str);
}

// url string validation 
export function isValidUrl(url) {
    if ((validator.isURL(url)) && (url.startsWith("https://") || url.startsWith("http://"))) {
        return true
    } else {
        return false
    }
}