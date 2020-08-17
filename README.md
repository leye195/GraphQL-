### GraphQL 공부 - Server

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

### GraphQL 구조

- query: 데이터를 읽는데 사용
- mutation: 데이터 변조하는데 사용

```
//일반 퀄리
{
    human(id:"123"){
        name
        age
    }
}
//오퍼레이션 쿼리
query HeroNameAndFriends($episode:Episode){
    hero(episode:$episode){

    }
}
```

gql을 구현한 클라이언트에서는 변수에 값을 할당할수 있는 함수 인터페이스가 존재한다.
react-apollo client 경우 variables 라는 파라미터에 원하는 값을 넣어주면된다.

```
//오퍼레이션 네임 쿼리
query getStudentInfomation($studentId:id){
    personInfo(studentId:$studentId){
        name
        address
        major
    }
    classInfo(year:2018,studentId:$studentId){
        classCode
        className
        teacher{
            name
            major
        }
        classRome{
            id
            maintainer{
                name
            }
        }
    }
    SATInfo(schoolCode:0042,studentId:$studentId){
        totalScore
        dueDate
    }
}
```

오퍼레이션 네임 쿼리는 쿼리용 함수다. DB의 procedure 개념과 유사하다고 생각하면된다.
기존의 REST API를 호출할 때와 다르게 한번의 연결으로 원하는 데이터를 한번에 가져올수 있다.

DB의 procedure은 DBA 혹은 백앤드에서 관리했지만 gql은 클라이언트에서 작성하고 관리한다.
gql 덕분에 백엔드롸 프론트엔드의 헙업 방식에도 영향이 생김, 이전의 REST API에서는 프론트는 백앤드가 작성하여
전달하는 API의 request와 response의 형식에 의존했지만 gql을 사용한 방식에서는 이러한 의존도가 사라졌다.
다만 데이터 schema에 대한 헙업 의존도는 존재한다.

### 스키마/타입(schema/type)

- 오브젝트 타입과 필드

```
type Character{
    name:String!
    appearsIn:[Episode!]!
}
```

오브젝트 타입: Character
필드: name, appearsIn
스칼라 타입: String, ID, Int 등
느낌표: 필수 값을 의미
대괄호: 배열 의미(Array)

### 리졸버(resolver)

gql에서 데이터를 가져오는 구체적인 과정은 resolver를 통해 직접 구현해야된다.
resolver를 통해 데이터를 데이터를 DB에서 가져올수 있고, 일반 파일에서 가져올수 있고, 심지어
http,soap같은 네트워크 프로토콜을 활용해 원격 데이터를 가져올수 있다.
이러한 특징을 이용하면 legacy 시스템을 gql기반으로 바꾸는데 활용 할 수 있다.

gql쿼리에서는 각각의 필드마다 함수가 하나씩 존재한다고 생각하면 되는데 이 함수는 다음 타입을 반환한다.
각각의 함수를 resolver라고 하며, 만약 필드가 스킬라 값(원시 타입인 경우) 실행이 종료된다.
필드의 타입이 우리가 정의한 타입이라면 해당 타입의 resolver를 호출한다.

```
type Query{
    users:[User]
    user(id:ID):User
    limits:[Limit]
    limit(UserId:ID):Limit
    paymentsByUser(UserId:ID):[Payment]
}

type User{
    id:ID!
    name:String!
    sex:SEX!
    birthDay:String!
    phoneNumber:String!
}

type Limit{
    id:ID!
    UserId:ID
    max:Int!
    amount:Int!
    user:User
}

type Payment{
    id:ID!
    limit:Limit!
    user:User!
    pg:PaymentGateway!
    productName:String!
    amount:Int!
    ref:String
    createdAt:String!
    updatedAt:String!
}

//resolver 함수
Query:{
    paymentByUser:async(parent,{userId},context,info)=>{
        const limit = await Limit.findOne({where:{UserId:userId}})
        const payments = await Payment.findAll({where:{LimitId:limit.id}})
        return payments
    }
},
Payment:{
    limit:async(payment,args,context,info)=>{
        return await Limit.findOne({where:{id:payment.LimitId}})
    }
}
//-첫 인자는 parent로 연쇄적 resolver 호출에서 부모 resolver가 리턴한 객체, 이 객체를 활용해 현재
//resolver가 내보낼 값을 조절 가능
//-두 번째 인자로 args로 쿼리에서 입력으로 넣을 인자
//-세번째 인자인 context는 모든 리졸버에게 전달이된다. 주로 미들웨어를 통해 입력된 값을이 들어있다.
//로그인 정보 혹은 권한 같은 주요 컨텍스트 관련 정보
//-마지막 인자인 info는 schema 정보와 현재 query의 특정 필드 정보를 가지고 있음(잘 사용하지 않음)

```

### Subscription

- subscription은 기본적으로 query 처럼 데이터 조회를 위해 사용되지만 작동 방식에 큰 차이가 있다.
  query와 mutation은 전통적인 서버/클라이언트 모델을 따르지만, subscription은 발행/구독 모델을 따른다.

- 접속자가 많은 서버에서 동시 다발적으로 변경이 발생하는 경우 클라이언트에서 아무리 자주 호출해도 완벽하게
  실시간을 달성하기 어렵고 변경이 자주 발생하지 않는 서버의 경우 클라이언트에서 자주 호출하는것 자체가 자원 낭비와 부담이 된다.

- pub/sub 모델을 따르면 gql의 subscription은 서버에서 발생하는 이벤트를 클라이언트에서 좀 더 효과적으로 인지할수 있게 해준다. subscription은 web socket 프로토콜을 사용해 클라이언트와 서버의 연결을 유지하며 서버에서 발생하는 이벤트를 실시간으로 수신받을수 있다.

```
import {ApolloServer,gql,PubSub} from "apollo-server";

//객체 생성
const pubsub = new PubSub();


//schema 정의
const typeDefs = gql`
    type Query{
        ping:String
    }
    type Subscription{
        messageAdded: String
    }
`;

//resolver 구현
ex)
const resolvers = {
    Query:{
        ping:()=>"pong";
    },
    Mutation{
        addPost:(_,args,{postModel})=>{
            pubsub.publish("POST_ADDED",{postAdded:args})
            return postModel.addPost(args);
        }
    },
    Subscription:{
        postAdded:{
            subscribe:()=>pubsub.asyncIterator(["POST_ADDED"])
        }
    }
    //asyncIterator()에 이벤트 명을 넘겨주면, subscription은 messageAdded가 발생할때 마다
    //반응하게 된다.
}

```

- 이벤트를 발생시킬때는 PubSub 객체의 publish() 메서드를 이용해 이벤트 이름과 이벤트 객체를 인자로 넘겨준다.

```
pubsub.publish("messageAdded",{
    messageAdded:()=>"message"
});
```

### GraphQL 활용을 위한 다양한 lib

gql 자체는 쿼리언어로서 gql하나로만으로는 할 수 있는게 없다. gql을 실제 구체적으로 활용할 수 있게 도와주는 라이브러리를 활용해야하낟.

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
   addMovie(title:"pung",rating:10){
       title
   }
   deleteMovie(id:12)
}

```
