
function PetCard({ name, attributes }) {
    return (
        <div className="petcard">
            <img src="https://via.placeholder.com/150" alt="picture"></img>
            <h2>{name}</h2>
            <p>Attributes: {attributes ? attributes.join(", ") : "No attributes available"}</p>
        </div>
    );
}

export default PetCard