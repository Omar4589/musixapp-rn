#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MusicKitBridge, NSObject)

RCT_EXTERN_METHOD(authorizeAndGetUserToken:(NSString *)devToken
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCapabilities:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end