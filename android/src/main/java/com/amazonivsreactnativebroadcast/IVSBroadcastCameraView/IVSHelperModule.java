package com.amazonivsreactnativebroadcast.IVSBroadcastCameraView;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import com.amazonaws.ivs.broadcast.*;
import com.facebook.react.uimanager.ThemedReactContext;

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
      List<Map<String, Object>> deviceList = new ArrayList<>();

      for (Device.Descriptor device : devices) {
        Map<String, Object> deviceMap = new HashMap<>();
        deviceMap.put("id", device.deviceId);
        deviceMap.put("name", device.friendlyName);
        deviceMap.put("urn", device.urn);
        deviceMap.put("type", device.type);
        deviceMap.put("position", device.position);

        Log.d("IVSHelperModule", "Device: " + device.friendlyName);
        deviceList.add(deviceMap);
      }

      promise.resolve(deviceList);
    } catch (Exception e) {
      Log.e("IVSHelperModule", "Error fetching devices: ", e);
      promise.reject("DEVICE_ERROR", "Error fetching devices", e);
    }
  }
}
