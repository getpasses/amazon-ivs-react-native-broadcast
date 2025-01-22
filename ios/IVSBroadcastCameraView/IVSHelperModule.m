//
//  IVSHelperModule.m
//  amazon-ivs-react-native-broadcast
//
//  Created by Jianlong Nie on 2025/1/13.
//

// RCTCalendarModule.m
#import "IVSHelperModule.h"
#import <AmazonIVSBroadcast/AmazonIVSBroadcast.h>

@implementation IVSHelperModule

// To export a module named RCTCalendarModule
RCT_EXPORT_MODULE();


RCT_EXPORT_METHOD(getAvailableDevices:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSArray<IVSDeviceDescriptor *> *devices = [IVSBroadcastSession listAvailableDevices];

    NSMutableArray *deviceList = [NSMutableArray array];
    for (IVSDeviceDescriptor *device in devices) {
      NSLog(@"Device: %@", device);
      [deviceList addObject:@{
        @"id": device.deviceId,
        @"name": device.friendlyName,
        @"urn": device.urn,
        @"type": @(device.type),
        @"position": @(device.position)
      }];
    }
    resolve(deviceList);
  });
}
@end
