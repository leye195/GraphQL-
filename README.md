### GraphQL 공부

## GraphQL 이란?

- GraphQL은 페이스북에서 만든 쿼리 언어로서 요즘 매운 핫 하며 인기 있음
- 기존에 사용하던 REST API를 대체 할 수 있으며 client가 기존에 backend와 통신해서
  데이터를 가져온던 방식에서 발생하는 over-fetching과 under-fetching을 해결해주며,
  기존의 URL 체계 방식이 아닌 하나의 end-point를 통해 데이터를 요청해서 받을수 있게 해줌으로 웹 클라이언트가 데이터를 서버로 부터 효율적으로 가져오게 해줌

### over-fetching이란?

frontend가 backend와 데이터를 요청해서 제공받은 데이터를 중에 사용하지 않는 데이터들이 포함 되어있다는 것.
즉, 본인이 원하는 정보의 범위를 넘어서 정보의 양을 서버로 부터 전달 받는 것

### under-fetching이란?

어떤 하나(기능 혹은 데이터)를 완성하기 위해 한 번에 여러 요청을 진행하는 경우 발생하는 것으로, 예를 들어 웹이 초기화를 진행할때
아래 3개의 API에 요청을 보낸다고 하자

- /feed
- /notifications
- /user/1 (3개의 요청이 전부 다 완료됟때까지 기다려야 만 화면이 에러 없이 잘 보인다는것 [요청이 3번 오고가야 문제 없이 완료됨])

- graphql은 1개의 end-point 만을 통해 통신을 진행하게 하여 under-fetching을 해결

#### 어떤 backend를 골라서 선택하던지 GraphQL을 적용 가능, client(frontend)는 GraphQL 서버로 요청을 보내고, GraphQL 서버는 다른 API 혹은 DB와의 통신을 진행하여 정보를 받은 뒤 frontend에서 사용될 정보들만 전달해준다.

### GraphQL 사용:

- 일단 사용하기 위해서는 npm install graphql-yoga 를 해준 다음 graphQL Server 셋팅을 진행해준다.

```
 ex)
import {GraphQLServer} from "graphql-yoga";
const server = new GraphQLServer({
    typeDefs: 'graphql/schema.graphql', //schema.graphql은 스캐마를 정의해주는 파일
    resolvers
});
server.start(()=>console.log("GraphQL server is running"));
```

- schema.graphql 와 resolver 정의
  schema 문서에는 3가지 를 정의 해준다
  query: 정보 요청시 사용
  mutation: 데이터 변형(update,delete)시 사용 함
  subscribe: (아직 뭔지 모름...)

```
ex) schema.graphql
type Movie{
    id: Int!
    title: String!
    rating: Float!
}

type Query{ //query 스캐마 정의
    movies:[Movie]!
    movie:Movie
}
type Mutation{ //mutation 스캐마 정의
    addMovie(title:String!,rating:Float!): Movie!
    deleteMovie(id:Int!):Boolean!
}

ex) resolver
const resolvers={
    Query:{
        movies:()=>getMovies(),
        movie:(_,{id})=>getMovie(id)
    },
    Mutation:{
        addMovie:(_,{title,rating})=>addMovie(title,rating),
        deleteMovie:(_,{id})=>deleteMovie(id)
    }
}

ex) db
export const addMovie=(title,rating)=>{
    const newMovie={
    id:`${movies.length+1}`,
    title,
    rating
    }
    movies.push(newMovie);
    return newMovie;
}
export const deleteMovie=(id)=>{
    const cleanedMovie = movies.filter(movie=>movie.id!==id);
    if(cleanedMovie.length<movies.length){
        movies = cleanedMovie;
        return True;
    }
    return False;
}


Playground 에서 확인 할 경우
query{
    movies{
        title
        rating
    }
    movie(id:12){
        title
        rating
    }
}
mutation{
   addMovie(title:"pung",rating:10)
}

```
