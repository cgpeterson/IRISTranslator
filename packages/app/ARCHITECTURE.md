# Code Architecture

This document explains the architecture and organization of the IRIS Translator codebase after refactoring.

## Directory Structure

```
src/
├── config/           # Configuration files (data, not logic)
├── hooks/            # Custom React hooks (reusable logic)
├── utils/            # Utility functions (pure, testable)
├── components/       # React components (UI)
│   ├── translator/   # Feature-specific components
│   └── ui/           # Reusable UI components
├── api/              # API clients and integrations
└── pages/            # Top-level page components
```

## Key Principles

### Separation of Concerns

1. **Configuration (`/config`)**: Static data and configuration objects
   - `translationModes.js` - Translation mode definitions
   - `categoryInfo.js` - Category metadata
   - `colorMaps.js` - Theme and color configurations

2. **Business Logic (`/hooks`)**: Reusable stateful logic
   - `useBase64.js` - Base64 encoding/decoding logic
   - `useTranslation.js` - AI translation functionality
   - `useDropdown.js` - Dropdown state management

3. **Utilities (`/utils`)**: Pure, testable functions
   - `base64.js` - Base64 encode/decode functions
   - `clipboard.js` - Clipboard operations

4. **Components (`/components`)**: UI presentation only
   - Should be as simple as possible
   - Use hooks for complex logic
   - Import from config for data

## Benefits

### 1. Reduced Merge Conflicts
- Engineers can work on different files without conflicts
- Configuration changes don't affect component files
- UI changes don't affect business logic

### 2. Better Testability
- Utilities are pure functions (easy to test)
- Hooks can be tested independently
- Components are simpler to test

### 3. Improved Maintainability
- Clear responsibility for each file
- Easy to find where to make changes
- Consistent patterns across the codebase

### 4. Enhanced Reusability
- Hooks can be used in multiple components
- Utilities can be imported anywhere
- Configuration is centralized

## Adding New Features

### Adding a New Translation Mode

1. Edit `/src/config/translationModes.js`
2. Add your mode to the appropriate category
3. No component changes needed!

### Adding a New Utility

1. Create a new file in `/src/utils/`
2. Export pure functions
3. Add JSDoc comments
4. Import where needed

### Adding a New Custom Hook

1. Create a new file in `/src/hooks/`
2. Start with `use` prefix (React convention)
3. Return an object with state and handlers
4. Add JSDoc comments

## Code Style Guidelines

- Use JSDoc comments for all exports
- Keep functions small and focused
- Prefer composition over inheritance
- Use meaningful variable names
- Extract magic numbers/strings to constants
