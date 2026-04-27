import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideShellTheme } from '@dexvis/shell';

bootstrapApplication(App, {
  providers: [
    provideShellTheme({
      storageKey: 'theme',
      defaultMode: 'auto',
    }),
  ],
}).catch(console.error);
