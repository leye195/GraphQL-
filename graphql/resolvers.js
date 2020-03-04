/**
 * Query를 resolve(해결) 하는 것
 * Query는 DB에게 문제같은 것으로
 * 어떤 방식으로 resolve 해줘야한다.
 *
 * Query를 이용해 객체를 반환할 경우 schema.graphql 안에
 * type obj{
 *   name:String!
 *   age:Int!
 * } 같은 형식으로 스캐마 정의를 진행해줘야 돤다.
 *
 */
import { getMovies, getById, getRecommendations } from "./db";

//view 유사, schema는 url 같은 것이라고 볼 수 있다.
const resolvers = {
  Query: {
    movies: (_, { limit, rating }) => getMovies(limit, rating),
    movie: (_, { id }) => getById(id),
    recommendations: (_, { id }) => getRecommendations(id)
  }
};
export default resolvers;
