export const formatTime = (value:number) => {
    if(value >= 60) {
        const hours = Math.floor(value / 60);
        const min = value % 60;
        if(min === 0) {
            return hours + '시간';
        }else{
            return hours + '시간'+ min + '분';
        }
        
    }
    return value + '분'
}