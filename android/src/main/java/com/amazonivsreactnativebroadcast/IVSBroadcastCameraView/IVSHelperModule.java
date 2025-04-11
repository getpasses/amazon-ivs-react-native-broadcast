package com.amazonivsreactnativebroadcast.IVSBroadcastCameraView;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.util.Arrays;
import java.util.List;
import com.amazonaws.ivs.broadcast.*;


public class IVSHelperModule extends ReactContextBaseJavaModule {
  private ReactApplicationContext mReactContext;
  public IVSHelperModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactContext = reactContext;
  }

  @Override
  public String getName() {
    return "IVSHelperModule";
  }

  @ReactMethod
  public void getAvailableDevices(Promise promise) {
    try {
      List<Device.Descriptor> devices = Arrays.asList(BroadcastSession.listAvailableDevices(mReactContext));
      WritableArray deviceArray = Arguments.createArray();

      for (Device.Descriptor device : devices) {
        WritableMap deviceMap = Arguments.createMap();
        deviceMap.putString("id", device.deviceId);
        deviceMap.putString("name", device.friendlyName);
        deviceMap.putString("urn", device.urn);
        deviceMap.putString("type", device.type != null ? device.type.toString() : null);
        deviceMap.putString("isDefault", Boolean.toString(device.isDefault));
        deviceMap.putString("position", device.position != null ? device.position.toString() : null);

        deviceArray.pushMap(deviceMap);
      }

      promise.resolve(deviceArray);
    } catch (Exception e) {
      Log.e("IVSHelperModule", "Error fetching devices: ", e);
      promise.reject("DEVICE_ERROR", "Error fetching devices", e);
    }
  }
}
