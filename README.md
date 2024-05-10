Enhanced Authentication API
This Node.js backend API provides enhanced authentication features, allowing users to set their profiles as public or private. Admin users have access to both public and private profiles, while normal users can only access public profiles.

User Stories
As a user, I can register a new account.
As a user, I can log in.
As a user, I can log in or register with at least one of the following services: Google, Facebook, Twitter, or GitHub.
As a user, I can sign out.
As a user, I can see my profile details.
As a user, I can edit my details including: photo, name, bio, phone, email, and password.
As a user, I can upload a new photo or provide an image URL.
As a user, I can choose to make my profile public or private.
As an admin user, I can see both public and private user profiles.
As a normal user, I can only see public user profiles.

1. Installation
Clone the repository:
git clone <repository_url>

2. Install dependencies:
   cd <project_folder>
   npm install

3. Create .env

PORT=5000
CORS_ORIGIN=
MONGO_URI=
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 
JWT_SECRET_KEY=
GOOGLE_CLIENT_ID = 
GOOGLE_CLIENT_SECRET = 
GOOGLE_CALLBACK_URL = 

4. Start the server:
   node server.js
   


