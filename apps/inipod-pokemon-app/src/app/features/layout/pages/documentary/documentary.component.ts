import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documentary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentary.component.html',
})
export class DocumentaryComponent {
  setupCommands = [
    {
      label: 'Clone the repository',
      cmd: 'git clone https://github.com/VanHoa-2002/inipod-pokemon-app.git',
    },
    {
      label: 'Install dependencies',
      cmd: 'npm install',
    },
    {
      label: 'Run frontend dev server',
      cmd: 'npx nx serve inipod-pokemon-app',
    },
    {
      label: 'Run backend (NestJS)',
      cmd: 'npx nx serve pokemon-backend',
    },
    {
      label: 'Build frontend',
      cmd: 'npx nx build inipod-pokemon-app',
    },
    {
      label: 'Build backend',
      cmd: 'npx nx build pokemon-backend',
    },
    {
      label: 'Show backend targets',
      cmd: 'npx nx show project pokemon-backend',
    },
    {
      label: 'Show graph project dependencies',
      cmd: 'npx nx graph',
    },
  ];

  generateCommands = [
    { label: 'New Angular app', cmd: 'npx nx g @nx/angular:app demo' },
    { label: 'New Angular lib', cmd: 'npx nx g @nx/angular:lib mylib' },
    { label: 'List plugins', cmd: 'npx nx list' },
    { label: 'Plugin capabilities', cmd: 'npx nx list @nx/angular' },
  ];

  featuresApp = [
    {
      label: 'Home Page',
      desc: 'Display a carousel of 4 Pokémon videos and show top 10 Pokémon from the backend.',
    },
    {
      label: 'Pokemon List Page',
      desc: 'Show all Pokémon with filter, search, pagination. Supports CSV import.',
    },
    {
      label: 'Pokemon Detail Page',
      desc: 'Show full Pokémon detail with stats and video.',
    },
    {
      label: 'Login Page',
      desc: 'Form to login using email and password.',
    },
    {
      label: 'Signup Page',
      desc: 'Form to register a new account.',
    },
    {
      label: 'Recover Password Page',
      desc: 'Form to trigger password recovery API.',
    },
    {
      label: 'Documentary Page',
      desc: 'Shows setup, features, and API documentation.',
    },
    {
      label: 'Policy Page',
      desc: 'App usage policy display.',
    },
  ];

  authApi = [
    { endpoint: '/api/auth/login', method: 'POST', desc: 'User login' },
    {
      endpoint: '/api/auth/register',
      method: 'POST',
      desc: 'User registration',
    },
    {
      endpoint: '/api/auth/recovery',
      method: 'POST',
      desc: 'Password recovery (send email/token)',
    },
  ];

  pokemonApi = [
    {
      endpoint: '/api/pokemon',
      method: 'GET',
      desc: 'Get all Pokémon (paginated)',
    },
    { endpoint: '/api/pokemon/:id', method: 'GET', desc: 'Get Pokémon by ID' },
    {
      endpoint: '/api/pokemon/import',
      method: 'POST',
      desc: 'Import Pokémon data from CSV',
    },
    {
      endpoint: '/api/pokemon/types',
      method: 'GET',
      desc: 'Get all Pokémon types',
    },
    {
      endpoint: '/api/pokemon/favorites',
      method: 'POST',
      desc: 'Add Pokémon to favorites',
    },
    {
      endpoint: '/api/pokemon/favorites',
      method: 'GET',
      desc: "Get user's favorite Pokémon",
    },
    {
      endpoint: '/api/pokemon/favorites/:id',
      method: 'DELETE',
      desc: 'Remove Pokémon from favorites',
    },
  ];

  techFeatures = [
    {
      title: 'Authentication & Security',
      items: [
        'JWT authentication using NestJS',
        'Email + password based login',
        'Token expiry and secure hash with Bcrypt',
        'Angular HttpInterceptor auto-attaches token',
        'AuthGuard for protected routes',
        'Recovery password API endpoint',
      ],
    },
    {
      title: 'Frontend – Angular 17',
      items: [
        'Standalone components with modern structure',
        'TailwindCSS for styling',
        'NgRx for state management (Auth done, Pokémon WIP)',
        'Responsive layout using Grid & Flexbox',
        'RouterLink, routerLinkActive, route guards',
      ],
    },
    {
      title: 'Backend – NestJS + PostgreSQL',
      items: [
        'NestJS framework with TypeORM',
        'PostgreSQL as the relational DB',
        'DTO + ValidationPipe for clean input validation',
        'Repository pattern for clean code structure',
        'Async/await, DI, modular service/controller structure',
      ],
    },
    {
      title: 'Debug & Dev Tools',
      items: [
        'Nx Monorepo – unified management of FE + BE',
        'Nx Graph for dependency visualization',
        'Nx Console (VSCode) for code generation',
        '.env config for DB + secrets',
      ],
    },
    {
      title: 'Project Structure',
      items: [
        'apps/inipod-pokemon-app – Angular frontend',
        'apps/pokemon-backend – NestJS backend',
        'libs/ – for potential shared logic',
        'Fully modular Angular app with lazy routes',
      ],
    },
  ];

  tools = [
    {
      label: 'Angular Standalone Components',
      link: 'https://angular.dev/guide/standalone-components',
    },
    {
      label: 'NestJS',
      link: 'https://nestjs.com/',
    },
    {
      label: 'PostgreSQL',
      link: 'https://www.postgresql.org/',
    },
    {
      label: 'TypeORM',
      link: 'https://typeorm.io/',
    },
    {
      label: 'TailwindCSS',
      link: 'https://tailwindcss.com/',
    },
    {
      label: 'NgRx',
      link: 'https://ngrx.io/',
    },
    {
      label: 'Nx Monorepo',
      link: 'https://nx.dev/',
    },
    {
      label: 'Nx Console for IDE',
      link: 'https://nx.dev/nx-console',
    },
  ];
}
