import React from 'react'
import styles from "../login/login.module.css"
const PriceCard = ({ data, isLoading }) => {
    return (
        <div className={`${styles.priceCard} shadow`}>
            {isLoading ?
                <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="spinner-grow"/>
                </div>
                :
                null}
            {data ? <div className="row">
                <div className="col-12 p-1 p-sm-1 p-lg-4">
                    <span className={`badge rounded-pill ${styles.badgeBg}`}>
                        {data.i}
                    </span>
                </div>
                <div className="col-12 text-center p-2 p-sm-2 p-lg-4">
                    <p className={styles.priceText}>{data.price}</p>
                </div>
                <div className="col-12 text-center">
                    <p className={styles.dateText}>Date :{data.dt}</p>
                </div>

            </div> : null}
        </div>
    )
}

export default PriceCard
