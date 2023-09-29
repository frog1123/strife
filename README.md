discord clone following this tutorial https://www.youtube.com/watch?v=ZbX4Ok9YX94

`cd client`

commands:

```
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma": "prisma generate --schema prisma/schema.prisma && prisma db push",
    "studio": "prisma studio",
    "migrate-reset": "prisma migrate reset"
```

env setup:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/0

DATABASE_URL=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```
