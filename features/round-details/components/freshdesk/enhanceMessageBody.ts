export function enhanceMessageBody(html: string) {
    return html
        .replace(
            /(https?:\/\/[^\s]+)/g,
            `<a href="$1" target="_blank" class="text-blue-600 underline font-medium inline-flex items-center gap-1">
                🔗 Open Link
            </a>`
        );
}