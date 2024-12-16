import bg from '../../../../../assets/bg.jpg';
const Banner = () => {
    return (
        <div className="banner">
            <div style={{ height: '12vh' }} className="banner">
                <img
                    src={`${bg}`}
                    alt="banner"
                    style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    className="d-block w-100"
                />
            </div>
        </div>
    )
}
export default Banner;