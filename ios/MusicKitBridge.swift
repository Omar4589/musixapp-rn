// MusicKitBridge.swift
import Foundation
import StoreKit
import React

@objc(MusicKitBridge)
class MusicKitBridge: NSObject {

  @objc(authorizeAndGetUserToken:resolver:rejecter:)
  func authorizeAndGetUserToken(devToken: NSString,
                                resolve: @escaping RCTPromiseResolveBlock,
                                reject: @escaping RCTPromiseRejectBlock) {

    SKCloudServiceController.requestAuthorization { status in
      switch status {
      case .authorized:
        let controller = SKCloudServiceController()
        controller.requestUserToken(forDeveloperToken: devToken as String) { userToken, error in
          if let error = error {
            reject("apple_user_token_error", error.localizedDescription, error)
            return
          }
          guard let userToken = userToken, !userToken.isEmpty else {
            reject("apple_user_token_empty", "Failed to get Apple Music user token.", nil)
            return
          }
          resolve(userToken)
        }
      case .denied:
        reject("apple_music_denied", "Apple Music permission denied.", nil)
      case .restricted:
        reject("apple_music_restricted", "Apple Music permission restricted.", nil)
      case .notDetermined:
        reject("apple_music_not_determined", "Apple Music permission not determined.", nil)
      @unknown default:
        reject("apple_music_unknown", "Unknown Apple Music auth status.", nil)
      }
    }
  }

  // Optional
  @objc(getCapabilities:rejecter:)
  func getCapabilities(resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
    let controller = SKCloudServiceController()
    controller.requestCapabilities { capabilities, error in
      if let error = error {
        reject("apple_caps_error", error.localizedDescription, error)
        return
      }
      let canPlayback = capabilities.contains(.musicCatalogPlayback)
      let canLibAdd = capabilities.contains(.addToCloudMusicLibrary)
      resolve([
        "canPlaybackCatalog": canPlayback,
        "canAddToLibrary": canLibAdd
      ])
    }
  }
}
