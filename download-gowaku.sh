#!/bin/sh

VERSION=`cat ./go-waku.VERSION`

ANDROID_TAR=gowaku-${VERSION}-android.tar.gz
IOS_TAR=gowaku-${VERSION}-ios.tar.gz
SHA_FILE=gowaku-${VERSION}.sha256

echo "Verifying go-waku libs..."

DOWNLOAD_IOS=false
DOWNLOAD_ANDROID=false

if [ "$1" = "--force" ]; then
    DOWNLOAD_IOS=true
    DOWNLOAD_ANDROID=true
fi

if ! test -f "./android/libs/gowaku.aar"; then
    echo "android does not exists."
    DOWNLOAD_ANDROID=true
fi

if ! test -d "./ios/Gowaku.xcframework"; then
    echo "ios does not exists."
    DOWNLOAD_IOS=true
fi

mkdir -p tmp
cd tmp

rm -f ${SHA_FILE}
wget "https://github.com/waku-org/go-waku/releases/download/v${VERSION}/${SHA_FILE}"

if [ "$DOWNLOAD_ANDROID" = true ]; then
    rm -f ${ANDROID_TAR}
    curl -L "https://github.com/waku-org/go-waku/releases/download/v${VERSION}/${ANDROID_TAR}" --output $ANDROID_TAR
    sha256sum --status --ignore-missing -c ${SHA_FILE}
    if ! sha256sum --status --ignore-missing -c ${SHA_FILE}; then
        echo "checksum failed - verify download"
        exit 1
    fi

    rm -f ../android/gowaku/gowaku*
    tar xvfz ${ANDROID_TAR} -C ../android/gowaku
fi

if [ "$DOWNLOAD_IOS" = true ]; then
    rm -f ${IOS_TAR}
    curl -L "https://github.com/waku-org/go-waku/releases/download/v${VERSION}/${IOS_TAR}" --output $IOS_TAR

    if ! sha256sum --status --ignore-missing -c ${SHA_FILE}; then
        echo "checksum failed - verify download"
        exit 1
    fi

    rm -rf ../ios/Gowaku.xcframework
    tar xvfz ${IOS_TAR} -C ../ios
    unlink ../ios/Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Gowaku 
    unlink ../ios/Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Resources 
    unlink ../ios/Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Versions/Current 
    unlink ../ios/Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Headers
    unlink ../ios/Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Modules
    unlink ../ios/Gowaku.xcframework/ios-arm64/Gowaku.framework/Gowaku 
    unlink ../ios/Gowaku.xcframework/ios-arm64/Gowaku.framework/Resources 
    unlink ../ios/Gowaku.xcframework/ios-arm64/Gowaku.framework/Versions/Current 
    unlink ../ios/Gowaku.xcframework/ios-arm64/Gowaku.framework/Headers
    unlink ../ios/Gowaku.xcframework/ios-arm64/Gowaku.framework/Modules
    mv -f ../ios/Gowaku.xcframework/ios-arm64/Gowaku.framework/Versions/A/* ../ios/Gowaku.xcframework/ios-arm64/Gowaku.framework/
    mv -f ../ios/Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Versions/A/* ../ios/Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/
    rm -rf ../ios/Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Versions/A
    rm -rf ../ios/Gowaku.xcframework/ios-arm64/Gowaku.framework/Versions/A
fi
