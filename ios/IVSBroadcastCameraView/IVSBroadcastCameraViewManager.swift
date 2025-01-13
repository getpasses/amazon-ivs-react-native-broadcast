import AmazonIVSBroadcast
import Foundation

@objc(RCTIVSBroadcastCameraView)
class IVSBroadcastCameraViewManager: RCTViewManager {
  
  override func view() -> UIView! {
    return IVSBroadcastCameraView()
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  // Static methods
  @objc public func START(_ node: NSNumber, options: NSDictionary) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(forReactTag: node) as! IVSBroadcastCameraView
      component.start(options)
    }
  }
  
  @objc public func STOP(_ node: NSNumber) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(forReactTag: node) as! IVSBroadcastCameraView
      component.stop()
    }
  }
  
  @available(*, message: "@Deprecated in favor of cameraPosition prop.")
  @objc public func SWAP_CAMERA(_ node: NSNumber) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(forReactTag: node) as! IVSBroadcastCameraView
      component.swapCamera()
    }
  }
  
  @objc public func GET_AVAILABLE_DEVICES(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
     DispatchQueue.main.async {
       let devices = IVSBroadcastSession.listAvailableDevices()
       
       let deviceList = devices.map { device -> [String: Any] in
         return [
          "id": device.deviceId,
           "type": device.type.rawValue,
           "position": device.position.rawValue
         ]
       }
       
       resolve(deviceList)
     }
   }
  
}

