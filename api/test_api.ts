import axios from 'axios';

const read_config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_TEST_API}`
    },
};


export const getComedyMovies = async () => {
    try {
        const response = await axios.get(`https://sampleapis.assimilate.be/movies/comedy`, read_config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}