import Foundation
import React

@objc(APNSTokenManager)
class APNSTokenManager: NSObject {
  private static var token: String?

  @objc static func setDeviceToken(_ apnsToken: String) {
    token = apnsToken
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc func getDeviceToken(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    if let token = APNSTokenManager.token {
      resolve(token)
    } else {
      resolve(nil) // ✅ After import, Swift will infer this as a String? for resolve
    }
  }
}
