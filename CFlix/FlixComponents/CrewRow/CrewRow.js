import React, {useState,useEffect} from 'react'
import "./CrewRow.css"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import requestAPI from '../../requests';
import notfound from "../Icons/notfound.gif"
import { getGenderString } from '../../utilities';
function CrewRow({data}) {
    const [crew, setCrew] = useState(null)

    useEffect(() => {
        setCrew(null)
        setCrew(data)
    }, [data])
    return (
         <div className="crew-row">
             {crew &&<>
                <hr/>
            <Carousel 
            showThumbs={true}
            showStatus={false}
            infiniteLoop
            emulateTouch
            // autoPlay
            showIndicators={false}
            
            useKeyboardArrows
            selectedItem={0}
            thumbWidth={70}
            >
                {crew.map((person) => {
                    return <div key={person.id} className="slide-holder">
                    <img src={person.profile_path?`${requestAPI.imgUrl}${person.profile_path}`:notfound }  />
                    <div className="text-container">
                        <a target="_blank" href={`https://www.themoviedb.org/person/${person.id}`}><h2 style={{textDecoration:"none"}}>{person.name}</h2></a>
                        <p>Known For: {person.known_for_department}</p>
                        <p>Character Name: {person.character}</p>
                        <p>Gender: {getGenderString(person.gender)}</p>
                    </div>
                </div>
            
                })}
                </Carousel>
            </>}
        </div>
    )
}

export default CrewRow
