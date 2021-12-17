# insta-mini-server

# Instructions to run the application back-end
1. Create a .env file in the root directory of the project folder.
2. Copy & paste Key-value pairs from the .env.example file
3. Create a new database schema named: 'insta_mini' in your MySQL Database
4. Update values in the .env file based on your own MySQL db connection string
5. Run following set of commands from the root directory of the project folder:

- yarn install
- yarn dev

# End-points and execution instructions

# Login
####Mutation
mutation login ($input: LoginUserInput!) {
  login(loginUserInput: $input) {
  	access_token 
  }
}

####Query Variables
{
  "input": {
  	"name":"Tahmid",
  	"password":"1234"
	}
} 

# User Create 
####Mutation
mutation createUser ($input: CreateUserInput!) {
  createUser(createUserInput:$input) {
    name
  }
}
####Query Variables
{
  "input": {
  	"name":"Tahmid",
  	"password":"1234"
	}
}
