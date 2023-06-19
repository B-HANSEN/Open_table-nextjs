# Application name

OpenTable

## Overview

### Application walkthrough

Main page:

- a header section with sign in/up functionalities. Password required to be strong: capital and small letters, numbers and special characters are required.
- a search section: The search is case insensitive.
- a results section which renders a selection of restaurants from the external database

Search page:

- shows all restaurants in the city that was searched in the main screen
- sidebar enables further filtering by region, cuisine and price. With NextJS, query parameters will be added dynamically.
- every restaurant has a 'View more information' button that links to the restaurant page. With NextJS, this works by revising the endpoint with a slug (the restaurant name).

Restaurant page:

- a header section with name and location of the restaurant
- a main section with an 'Overview' button which is selected by default. The user can navigate to the menu by using the 'Menu' button.
- the 'Overview' section also renders a description, a star rating and user reviews.
- the user can search for availability on the reservation section and make reservations.

Reservation page:

- top section renders reservation details
- the form requires user input of at least name, phone number and email to enable the 'Complete reservation' button

Notes: limited functionality due to dataset in database

- main page/ search section: results only for cities Ottawa, Niagara and Toronto
- restaurant page/ reservation section: results only shown for 'Vivaan - fine Indian restaurant'

## Architecture Overview

A React application built with NextJS and TypeScript.
Middleware to verify JSON webtokens and handle authentication.
Prisma to communicate with a PostgreSQL database on supabase.com.

### Start Application

To start the application, install packages with `npm install` and then run `npm run dev`.
The app will be running on http://localhost:3000/.
