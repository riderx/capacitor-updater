import type { PluginListenerHandle } from '@capacitor/core';

export interface DownloadEvent {
  /**
   * Current status of download, between 0 and 100.
   *
   * @since 2.0.11
   */
  percent: number;
}
export interface MajorAvailableEvent {
  /**
   * Emit when a new major version is available.
   *
   * @since 2.3.0
   */
  version: VersionInfo;
}
export interface UpdateAvailableEvent {
  /**
   * Emit when a new update is available.
   *
   * @since 3.0.0
   */
  version: VersionInfo;
}

export interface VersionInfo {
  version: string;
  status: VersionStatus
}

export type VersionStatus = 'success' | 'error' | 'pending';

export type DownloadChangeListener = (state: DownloadEvent) => void;
export type MajorAvailableListener = (state: MajorAvailableEvent) => void;
export type UpdateAvailableListener = (state: UpdateAvailableEvent) => void;
export interface CapacitorUpdaterPlugin {
    /**
   * Download a new version from the provided URL, it should be a zip file, with files inside or with a unique folder inside with all your files
   * @returns {Promise<VersionInfo>} an Promise with version name of the downloaded version, version is generated by the plugin, it's a random string of 10 char length
   * @param url The URL where download the version, it can be S3 github tag or whatever, it should be a zip file
   */
  download(options: { url: string }): Promise<VersionInfo>;
    /**
   * Set version as current version, set will return an error if there are is no index.html file inside the version folder. `versionName` is optional and it's a custom value that will be saved for you
   * @returns {Promise<void>} an empty Promise when the version is set, if there are no index.html or no version folder throw an error
   * @param version The version name to set as current version
   */
  set(options: { version: string, versionName?: string }): Promise<VersionInfo>;
    /**
   * Get unique ID used to identify device into auto update server
   * @returns {Promise<{ id: string }>} an Promise with id for this device
   */
  getId(): Promise<{ id: string }>;
    /**
   * Delete version in storage
   * @returns {Promise<void>} an empty Promise when the version is delete, otherwise throw an error
   * @param version The version name to delete
   */
  delete(options: { version: string }): Promise<void>;
    /**
   * Get all available versions
   * @returns {Promise<{version: VersionInfo[]}>} an Promise witht the version list
   */
  list(): Promise<{ versions: VersionInfo[] }>;
    /**
   * Set the `builtin` version (the one sent to Apple store / Google play store ) as current version
   * @returns {Promise<void>} an empty Promise
   * @param toAutoUpdate [false] if yes it reset to to the last AutoUpdate version instead of `builtin`
   */
  reset(options?:{ toAutoUpdate?: boolean }): Promise<void>;
    /**
   * Get the current version, if none are set it returns `builtin`, currentNative is the original version install on the device
   * @returns {Promise<{ current: string, currentNative: string }>} an Promise with the current version name
   */
  current(): Promise<{ bundle: VersionInfo, native: string }>;
    /**
   * Reload the view
   * @returns {Promise<void>} an Promise resolved when the view is reloaded
   */
  reload(): Promise<void>;
  /**
   * Notify native plugin that the update is working, only in auto-update
   * @returns {Promise<void>} an Promise resolved directly
   */
  notifyAppReady(): Promise<VersionInfo>;
  /**
   * Skip updates in the next time the app goes into the background, only in auto-update
   * @returns {Promise<void>} an Promise resolved directly
   */
  delayUpdate(): Promise<void>;
  /**
   * allow update in the next time the app goes into the background, only in auto-update
   * @returns {Promise<void>} an Promise resolved directly
   */
  cancelDelay(): Promise<void>;

  /**
   * Listen for download event in the App, let you know when the download is started, loading and finished
   *
   * @since 2.0.11
   */
  addListener(
    eventName: 'download',
    listenerFunc: DownloadChangeListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  /**
   * Listen for Major update event in the App, let you know when major update is blocked by setting disableAutoUpdateBreaking
   *
   * @since 2.3.0
   */
  addListener(
    eventName: 'majorAvailable',
    listenerFunc: MajorAvailableListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
  /**
   * Listen for update event in the App, let you know when update is ready to install at next app start
   *
   * @since 2.3.0
   */
  addListener(
    eventName: 'updateAvailable',
    listenerFunc: UpdateAvailableListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
}
