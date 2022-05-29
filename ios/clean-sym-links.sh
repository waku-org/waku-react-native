#!/bin/bash
unlink ./Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Gowaku 
unlink ./Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Resources 
unlink ./Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Versions/Current 
unlink ./Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Headers
unlink ./Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Modules
mv ./Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Versions/A/* ./Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/
rm -rf ./Gowaku.xcframework/ios-arm64_x86_64-simulator/Gowaku.framework/Versions/A
unlink ./Gowaku.xcframework/ios-arm64/Gowaku.framework/Gowaku 
unlink ./Gowaku.xcframework/ios-arm64/Gowaku.framework/Resources 
unlink ./Gowaku.xcframework/ios-arm64/Gowaku.framework/Versions/Current 
unlink ./Gowaku.xcframework/ios-arm64/Gowaku.framework/Headers
unlink ./Gowaku.xcframework/ios-arm64/Gowaku.framework/Modules
mv ./Gowaku.xcframework/ios-arm64/Gowaku.framework/Versions/A/* ./Gowaku.xcframework/ios-arm64/Gowaku.framework/
rm -rf ./Gowaku.xcframework/ios-arm64/Gowaku.framework/Versions/A