import { MovieTest } from '@/types';
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

export const getComedyMovie = async (id: number) => {
    try {
        const response = await axios.get(`https://sampleapis.assimilate.be/movies/comedy/${id}`, read_config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const updateComedyMovie = async (id: number, data: MovieTest) => {
    try {
        const response = await axios.put(`https://sampleapis.assimilate.be/movies/comedy/${id}`, data, read_config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const deleteComedyMovie = async (id: number) => {
    try {
        const response = await axios.delete(`https://sampleapis.assimilate.be/movies/comedy/${id}`, read_config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const createComedyMovie = async (data: MovieTest) => {
    try {
        const response = await axios.post(`https://sampleapis.assimilate.be/movies/comedy`, data, read_config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}