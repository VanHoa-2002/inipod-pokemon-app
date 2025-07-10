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
    { label: 'Run backend', cmd: 'npx nx serve api' },
    { label: 'Build frontend', cmd: 'npx nx build inipod-pokemon-app' },
    { label: 'Build backend', cmd: 'npx nx build api' },
    { label: 'Show backend targets', cmd: 'npx nx show project api' },
    { label: 'Show graph project dependencies', cmd: 'npx nx graph' },
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
      desc: 'Display a carousel of 4 Pokemon videos from the database and show the top 10 Pokemon from the first query.',
    },
    {
      label: 'Pokemon List Page',
      desc: 'Display all Pokemon with search, filter, and pagination. Also, display the favorite Pokemon. The user can import a CSV file to add Pokemon to the database(if it is not in the database).',
    },
    {
      label: 'Pokemon Detail Page',
      desc: 'Display Pokemon details with video and information.',
    },
    {
      label: 'Login Page',
      desc: 'Display the login form. Using for user login.',
    },
    {
      label: 'Signup Page',
      desc: 'Display the registration form. Using for user registration.',
    },
    {
      label: 'Recover Password Page',
      desc: 'Display the recover password form. Using for user recover password.',
    },
    {
      label: 'Documentary Page',
      desc: 'Display the documentary page. Using for user see the documentary of the app.',
    },
    {
      label: 'Policy Page',
      desc: 'Display the policy page. Using for user see the policy of the app.',
    },
  ];

  authApi = [
    { endpoint: '/api/auth/login', method: 'POST', desc: 'User login' },
    { endpoint: '/api/auth/signup', method: 'POST', desc: 'User registration' },
    {
      endpoint: '/api/auth/recovery-password',
      method: 'POST',
      desc: 'User recover password',
    },
  ];
  techFeatures = [
    {
      title: 'Authentication & Security',
      items: [
        'JWT (JSON Web Token) – used for frontend/backend authentication',
        'Token Expiry Testing – configure short expiry for session testing',
        'AuthGuard (Angular) – protect routes from unauthenticated access',
        'HTTP Interceptor – auto-attach token to Authorization headers',
      ],
    },
    {
      title: 'Frontend – Angular',
      items: [
        'Standalone Components – simplified Angular structure without modules',
        'TailwindCSS – fast and responsive utility-first styling',
        'RouterLink + routerLinkActive – routing and active menu highlight',
        'Responsive Navbar – mobile toggle with *ngIf and toggle variable',
        'NgFor + TrackBy – efficient list rendering in templates',
      ],
    },
    {
      title: 'Backend – Express + MongoDB',
      items: [
        'Express Router – separate route groups for auth and Pokemon',
        'JWT Middleware – verify token for protected API access',
        'Mongoose Models – define MongoDB schemas cleanly',
        'Custom Endpoints – /with-videos and /top Pokemon APIs',
      ],
    },
    {
      title: 'Debug & Dev Tools',
      items: [
        'Nx Monorepo – manage frontend and backend in a unified workspace',
        'Nx Graph – visualize project structure (`npx nx graph`)',
        'Nx Console – VSCode plugin for code generation and task running',
        'Environment Config (.env) – manage secrets like JWT and Mongo URI',
      ],
    },
    {
      title: 'Project Structure',
      items: [
        'apps/ – contains separate frontend and backend projects',
        'routes/, models/ – cleanly organized Express logic',
        'Reusable components for layout, footer, policy, documentary, etc.',
      ],
    },
  ];

  pokemonApi = [
    { endpoint: '/api/pokemon', method: 'GET', desc: 'Get all Pokemon' },
    { endpoint: '/api/pokemon/:id', method: 'GET', desc: 'Get Pokemon by ID' },
    {
      endpoint: '/api/pokemon/import',
      method: 'POST',
      desc: 'Import Pokemon data from CSV',
    },
    {
      endpoint: '/api/pokemon/types',
      method: 'GET',
      desc: 'Get Pokemon types',
    },
    {
      endpoint: '/api/pokemon/favorites',
      method: 'POST',
      desc: 'Add Pokemon to favorites',
    },
    {
      endpoint: '/api/pokemon/favorites',
      method: 'GET',
      desc: 'Get user favorites',
    },
    {
      endpoint: '/api/pokemon/favorites/:id',
      method: 'DELETE',
      desc: 'Remove Pokemon from favorites',
    },
  ];

  tools = [
    {
      label: 'Angular Standalone Components',
      link: 'https://angular.dev/guide/standalone-components',
    },
    {
      label: 'ExpressJS (Node.js)',
      link: 'https://expressjs.com/',
    },
    {
      label: 'MongoDB',
      link: 'https://www.mongodb.com/',
    },
    {
      label: 'TailwindCSS',
      link: 'https://tailwindcss.com/',
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
