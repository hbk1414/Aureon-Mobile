import { AppState, AppStateStatus } from 'react-native';
import { trueLayerDataService } from '../services/truelayerDataService';

interface SyncConfig {
  intervalMinutes: number;
  syncOnAppForeground: boolean;
  syncOnAppBackground: boolean;
  maxRetries: number;
}

class DataSyncService {
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing = false;
  private retryCount = 0;
  private config: SyncConfig = {
    intervalMinutes: 15, // Sync every 15 minutes
    syncOnAppForeground: true,
    syncOnAppBackground: false,
    maxRetries: 3,
  };

  constructor() {
    this.setupAppStateListener();
  }

  private setupAppStateListener() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && this.config.syncOnAppForeground) {
      console.log('[Sync] App became active, triggering sync...');
      this.syncData();
    } else if (nextAppState === 'background' && this.config.syncOnAppBackground) {
      console.log('[Sync] App went to background, triggering sync...');
      this.syncData();
    }
  };

  startPeriodicSync(): void {
    if (this.syncInterval) {
      console.log('[Sync] Periodic sync already running');
      return;
    }

    console.log(`[Sync] Starting periodic sync every ${this.config.intervalMinutes} minutes`);
    
    this.syncInterval = setInterval(() => {
      this.syncData();
    }, this.config.intervalMinutes * 60 * 1000);

    // Initial sync
    this.syncData();
  }

  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('[Sync] Periodic sync stopped');
    }
  }

  async syncData(): Promise<boolean> {
    if (this.isSyncing) {
      console.log('[Sync] Sync already in progress, skipping...');
      return false;
    }

    try {
      this.isSyncing = true;
      console.log('[Sync] Starting data sync...');

      const syncData = await trueLayerDataService.syncAllData();
      
      console.log('[Sync] Data sync completed successfully:', {
        accounts: syncData.accounts.length,
        balances: syncData.balances.length,
        transactionAccounts: Object.keys(syncData.transactions).length,
      });

      // Reset retry count on successful sync
      this.retryCount = 0;
      return true;
    } catch (error) {
      console.error('[Sync] Data sync failed:', error);
      
      this.retryCount++;
      if (this.retryCount < this.config.maxRetries) {
        console.log(`[Sync] Retrying sync (${this.retryCount}/${this.config.maxRetries})...`);
        // Exponential backoff: wait 2^retryCount minutes before retry
        const retryDelay = Math.pow(2, this.retryCount) * 60 * 1000;
        setTimeout(() => {
          this.syncData();
        }, retryDelay);
      } else {
        console.error('[Sync] Max retries reached, sync failed');
        this.retryCount = 0; // Reset for next manual sync
      }
      
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  updateConfig(newConfig: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[Sync] Config updated:', this.config);
    
    // Restart periodic sync if interval changed
    if (newConfig.intervalMinutes && this.syncInterval) {
      this.stopPeriodicSync();
      this.startPeriodicSync();
    }
  }

  getConfig(): SyncConfig {
    return { ...this.config };
  }

  getStatus(): {
    isRunning: boolean;
    isSyncing: boolean;
    retryCount: number;
    nextSyncIn?: number;
  } {
    return {
      isRunning: this.syncInterval !== null,
      isSyncing: this.isSyncing,
      retryCount: this.retryCount,
    };
  }

  // Manual sync with callback
  async manualSync(onComplete?: (success: boolean) => void): Promise<void> {
    try {
      const success = await this.syncData();
      onComplete?.(success);
    } catch (error) {
      console.error('[Sync] Manual sync failed:', error);
      onComplete?.(false);
    }
  }

  // Cleanup
  destroy(): void {
    this.stopPeriodicSync();
    AppState.removeEventListener('change', this.handleAppStateChange);
    console.log('[Sync] Data sync service destroyed');
  }
}

// Export singleton instance
export const dataSyncService = new DataSyncService();

// Export types
export type { SyncConfig };
