#!/bin/sh

function join_by() {
    local d=${1-} f=${2-}
    if shift 2; then printf %s "$f" "${@/#/$d}"; fi
}

function validate_package() {
    local package_name=$1
    if [ "$package_name" != "ds" ] && [ "$package_name" != "util" ]; then
        echo "Error: Incorrect package. Must be one of \"ds\" and \"util\"."
        exit 1
    fi
}
