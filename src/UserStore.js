import { atom, useAtom} from 'jotai'

// create an atom to share the JWT (atom ==> shared state)
const jwtAtom = atom(null);

// A hook in react basically adds more function to a React component
export  function useJwt() {

    const [jwt, setJwtAtom] = useAtom(jwtAtom);

    const setJwt = (newJwt) => {
        // localstorage persist when the browser is closed
        localStorage.setItem('jwt', newJwt);
        // save to jotai for sharing with other components
        setJwtAtom(newJwt);
    }

    const getJwt = () => {
        // localStorage is a key/value pair store
        // available in all browsers
        // you can store data via a key
        const storedJwt = localStorage.getItem('jwt');
        if (storedJwt && !jwt) {
            // if there's a JWT in the localstorage but not in Jotai
            setJwtAtom(storedJwt);
        }

        return jwt || storedJwt;
    }

    const clearJwt = () => {
        localStorage.removeItem('jwt');
        setJwtAtom(null);
    }

    return {
        jwt,
        setJwt,
        getJwt,
        clearJwt
    }

}