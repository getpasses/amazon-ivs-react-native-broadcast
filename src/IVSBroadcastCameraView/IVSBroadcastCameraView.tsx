import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  findNodeHandle,
  Platform,
  requireNativeComponent,
  UIManager,
} from 'react-native';

import {
  BroadcastQuality,
  BroadcastQualityEnum,
  Command,
  IIVSBroadcastCameraNativeViewProps,
  IIVSBroadcastCameraView,
  IIVSBroadcastCameraViewProps,
  NetworkHealth,
  NetworkHealthEnum,
  StateStatusEnum,
  StateStatusUnion,
} from './IVSBroadcastCameraView.types';

const isNumber = (value: unknown): value is number => typeof value === 'number';

const UNKNOWN = 'unknown';
export const NATIVE_VIEW_NAME = 'RCTIVSBroadcastCameraView';

const NATIVE_SIDE_COMMANDS =
  UIManager.getViewManagerConfig(NATIVE_VIEW_NAME).Commands;

const RCTIVSBroadcastCameraView =
  requireNativeComponent<IIVSBroadcastCameraNativeViewProps>(NATIVE_VIEW_NAME);

export const getCommandIdByPlatform = (command: Command) => {
  switch (Platform.OS) {
    case 'android': {
      return command;
    }
    case 'ios': {
      return NATIVE_SIDE_COMMANDS[command];
    }
    default: {
      return '';
    }
  }
};

export const IVSBroadcastCameraView = forwardRef<
  IIVSBroadcastCameraView,
  IIVSBroadcastCameraViewProps
>((props, parentRef) => {
  const {
    onError,
    onBroadcastError,
    onIsBroadcastReady,
    onBroadcastAudioStats,
    onBroadcastStateChanged,
    onBroadcastQualityChanged,
    onNetworkHealthChanged,
    onTransmissionStatisticsChanged,
    onAudioSessionInterrupted,
    onAudioSessionResumed,
    onMediaServicesWereLost,
    onMediaServicesWereReset,
    isMuted = false,
    isCameraPreviewMirrored = false,
    cameraPosition = 'back',
    cameraPreviewAspectMode = 'none',
    logLevel = 'error',
    sessionLogLevel = 'error',
    ...restProps
  } = props;

  const nativeViewRef = useRef(null);

  useImperativeHandle<
    IIVSBroadcastCameraView,
    IIVSBroadcastCameraView
  >(parentRef, () => {
    const reactTag = findNodeHandle(nativeViewRef.current);

    const dispatchViewManagerCommand = (
      command: Command,
      ...params: unknown[]
    ) =>
      UIManager.dispatchViewManagerCommand(
        reactTag,
        getCommandIdByPlatform(command),
        params ?? []
      );

    return {
      start: (
        options: Parameters<IIVSBroadcastCameraView['start']>[number] = {}
      ) => dispatchViewManagerCommand(Command.Start, options),
      stop: () => dispatchViewManagerCommand(Command.Stop),
      swapCamera: (urn:string) => dispatchViewManagerCommand(Command.SwapCamera,urn),
      swapMicrophone: (urn:string) => dispatchViewManagerCommand(Command.SwapMicrophone,urn),
    };
  }, []);

  const onErrorHandler: IIVSBroadcastCameraNativeViewProps['onError'] = ({
    nativeEvent,
  }) => onError?.(nativeEvent.message);

  const onBroadcastErrorHandler: IIVSBroadcastCameraNativeViewProps['onBroadcastError'] =
    ({ nativeEvent }) => {
      const { code, type, detail, source, isFatal, sessionId } =
        nativeEvent.exception;

      onBroadcastError?.({
        code: String(code) ?? UNKNOWN,
        type: type ?? UNKNOWN,
        source: source ?? UNKNOWN,
        detail: detail ?? '',
        isFatal: !!isFatal,
        sessionId: sessionId ?? UNKNOWN,
      });
    };

  const onIsBroadcastReadyHandler: IIVSBroadcastCameraNativeViewProps['onIsBroadcastReady'] =
    ({ nativeEvent }) => onIsBroadcastReady?.(nativeEvent.isReady);

  const onBroadcastAudioStatsHandler: IIVSBroadcastCameraNativeViewProps['onBroadcastAudioStats'] =
    ({ nativeEvent }) => onBroadcastAudioStats?.(nativeEvent.audioStats);

  const onBroadcastStateChangedHandler: IIVSBroadcastCameraNativeViewProps['onBroadcastStateChanged'] =
    ({ nativeEvent }) => {
      const { stateStatus: incomingStateStatus, metadata } = nativeEvent;
      const outcomingStateStatus = isNumber(incomingStateStatus)
        ? (StateStatusEnum[incomingStateStatus] as StateStatusUnion)
        : incomingStateStatus;
      onBroadcastStateChanged?.(outcomingStateStatus, metadata);
    };

  /**
   * @deprecated in favor of {@link onTransmissionStatisticsChangedHandler}
   */
  const onNetworkHealthChangedHandler: IIVSBroadcastCameraNativeViewProps['onNetworkHealthChanged'] =
    ({ nativeEvent }) => onNetworkHealthChanged?.(nativeEvent.networkHealth);

  /**
   * @deprecated in favor of {@link onTransmissionStatisticsChangedHandler}
   */
  const onBroadcastQualityChangedHandler: IIVSBroadcastCameraNativeViewProps['onBroadcastQualityChanged'] =
    ({ nativeEvent }) => onBroadcastQualityChanged?.(nativeEvent.quality);

  const onTransmissionStatisticsChangedHandler: IIVSBroadcastCameraNativeViewProps['onTransmissionStatisticsChanged'] =
    ({ nativeEvent }) => {
      const {
        networkHealth: incomingNetworkHealth,
        broadcastQuality: incomingBroadcastQuality,
        ...rest
      } = nativeEvent.statistics;

      const networkHealth = isNumber(incomingNetworkHealth)
        ? (NetworkHealthEnum[incomingNetworkHealth] as NetworkHealth)
        : incomingNetworkHealth;
      const broadcastQuality = isNumber(incomingBroadcastQuality)
        ? (BroadcastQualityEnum[incomingBroadcastQuality] as BroadcastQuality)
        : incomingBroadcastQuality;

      return onTransmissionStatisticsChanged?.({
        networkHealth,
        broadcastQuality,
        ...rest,
      });
    };

  const onAudioSessionInterruptedHandler: IIVSBroadcastCameraNativeViewProps['onAudioSessionInterrupted'] =
    () => onAudioSessionInterrupted?.();

  const onAudioSessionResumedHandler: IIVSBroadcastCameraNativeViewProps['onAudioSessionResumed'] =
    () => onAudioSessionResumed?.();

  const onMediaServicesWereLostHandler: IIVSBroadcastCameraNativeViewProps['onMediaServicesWereLost'] =
    () => onMediaServicesWereLost?.();

  const onMediaServicesWereResetHandler: IIVSBroadcastCameraNativeViewProps['onMediaServicesWereReset'] =
    () => onMediaServicesWereReset?.();

  return (
    <RCTIVSBroadcastCameraView
      testID={NATIVE_VIEW_NAME}
      {...restProps}
      cameraPosition={cameraPosition}
      cameraPreviewAspectMode={cameraPreviewAspectMode}
      isCameraPreviewMirrored={isCameraPreviewMirrored}
      isMuted={isMuted}
      logLevel={logLevel}
      onAudioSessionInterrupted={onAudioSessionInterruptedHandler}
      onAudioSessionResumed={onAudioSessionResumedHandler}
      onBroadcastAudioStats={onBroadcastAudioStatsHandler}
      onBroadcastError={onBroadcastErrorHandler}
      onBroadcastQualityChanged={onBroadcastQualityChangedHandler}
      onBroadcastStateChanged={onBroadcastStateChangedHandler}
      onError={onErrorHandler}
      onIsBroadcastReady={onIsBroadcastReadyHandler}
      onMediaServicesWereLost={onMediaServicesWereLostHandler}
      onMediaServicesWereReset={onMediaServicesWereResetHandler}
      onNetworkHealthChanged={onNetworkHealthChangedHandler}
      onTransmissionStatisticsChanged={onTransmissionStatisticsChangedHandler}
      ref={nativeViewRef}
      sessionLogLevel={sessionLogLevel}
    />
  );
});

