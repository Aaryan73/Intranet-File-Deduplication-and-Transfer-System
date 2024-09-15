import re


def convert_urls_to_str(user_data: dict) -> dict:
    # Regex pattern for URL validation
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    for field_name, field_value in user_data.items():
        if field_value is not None and not isinstance(field_value, str):
            str_value = str(field_value)
            if url_pattern.match(str_value):
                user_data[field_name] = str_value

    return user_data