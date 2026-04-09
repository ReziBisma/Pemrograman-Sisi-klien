function Judul({nama}){
    return <div>
        <h1>Agent {nama}</h1>
    </div>
}

function Isi(){
    return <div>
        <p>Septian dan Rayantol sudah sangat terpojok karena kemunculan agent bali dan agent bandung secara tiba tiba</p>
        <p>ditengah itu tiba tiba CEO Basreng muncul, ikut merusuh. Agent CEO Basreng berubah ke wujdu silumannya</p>
        <p>tapi nampaknya tidak akan mudah di hentikan, Septian akhrirnya menggunakan kekuatan terakhirnya yaitu memanggik</p>
        <p>siluman dongkrak</p>
    </div>
}

function Artikel({nama}){
    return <div>
        <Judul nama = {nama}/>
        <Isi/>
    </div>
}

function App(){
    return  <div>
        <Artikel nama = "Septian"/>
        <Artikel nama = "Rayantol"/>
        <Artikel nama = "CEO Basreng"/>
    </div>
}

export default App;