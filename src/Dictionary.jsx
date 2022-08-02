import React from 'react';
import { Panel, InputGroup, Input, List, Row, Col, Button, Loader } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import CloseIcon from '@rsuite/icons/Close';
import { HTTP } from './crudService';

const Dictionary = () => {

    const [search, setSearch] = React.useState('');
    const [Results, setResults] = React.useState([]);
    const [Meanings, setMeanings] = React.useState([]);
    const [loader, setLoader] = React.useState(false);

    const handleSearchChange = (ev) => {
        setSearch(ev)
    }

    const fireSearch = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    }

    const handleSearchSubmit = () => {
        if (search != null && search.length > 2) {
            getData();
        } else {
        }
    }

    const handleSearchClear = () => {
        setSearch('');
        setResults([]);
        setMeanings([]);
    }

    const handlePlayAudio = (dd) => {
        if (dd.audio) {
            var audio = new Audio(dd.audio);
            audio.play();
        }
    }

    const getData = async () => {
        setLoader(true);
        try {
            await HTTP.get("api/v2/entries/en/" + search.trim())
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        //console.log(res.data[0])
                        setResults(res.data[0])
                        setMeanings(res.data[0].meanings)
                    }
                    setLoader(false);
                })
        } catch (err) {
            console.log(err);
            setLoader(false);
        }
    }

    return (
        <div>
            <h4 style={{ textAlign: 'center' }}>Simple Dictionary</h4>
            <Panel header="Search" bordered shaded style={{ marginLeft: '5px' }}>
                <InputGroup>
                    <Input placeholder="search" value={search} onKeyDown={fireSearch} onChange={handleSearchChange} />
                    <InputGroup.Button onClick={handleSearchClear}><CloseIcon /></InputGroup.Button>
                    <InputGroup.Button onClick={handleSearchSubmit}><SearchIcon /></InputGroup.Button>
                </InputGroup>
            </Panel>
            <br />
            {loader ? <Loader backdrop content="loading..." vertical /> : null}
            <Panel header="Search Results" bordered shaded style={{ marginLeft: '5px' }}>
                {Results.word ? <h4 style={{ marginBottom: '10px' }}>Searched Word: {Results.word}</h4> : <div style={{ textAlign: 'center' }}>No Results found</div>}
                {Results.phonetics && Results.phonetics.length > 0 ?
                    <Panel bordered shaded>
                        <Row>
                            <Col>
                                <h5>Phonetics : </h5>
                                {
                                    Results.phonetics.map((itemph, indph) => (
                                        <Button key={indph} appearance="subtle" onClick={() => handlePlayAudio(itemph)}><Input plaintext value={itemph.text} /></Button>
                                    ))
                                }
                            </Col>
                            <Col>
                                <h5>Source : </h5>
                                {
                                    Results.sourceUrls.map((itemss, indss) => (
                                        <Button key={indss} appearance="link" href={itemss} target="_blank">{itemss}</Button>
                                    ))
                                }
                            </Col>
                        </Row>
                    </Panel> : null}
                {Meanings.map((item, ind) => (
                    <Panel key={ind} bordered shaded>
                        <h5 style={{ textTransform: 'capitalize' }}>{item.partOfSpeech}</h5><br />
                        <Row>
                            <Col>
                                <h5>Definitions: </h5><br />
                                <List size="sm" bordered hover>
                                    {item.definitions.map((ite1, iid1) => (
                                        <List.Item key={iid1}>
                                            {ite1.definition ? <Input plaintext value={ite1.definition} /> : null}
                                        </List.Item>
                                    ))}
                                </List>
                            </Col>
                            {item.definitions.length > 0 ? <Col>
                                <h5>Examples: </h5><br />
                                <List size="sm" bordered hover>
                                    {item.definitions.map((ite1, iid1) => (
                                        ite1.example ? <List.Item key={iid1}>
                                            <Input plaintext value={ite1.example} />
                                        </List.Item> : null
                                    ))}
                                </List>
                            </Col> : null}
                            {item.synonyms.length > 0 ? <Col>
                                <h5>Synonyms: </h5><br />
                                <List size="sm" bordered hover>
                                    {item.synonyms.map((ite1, iid1) => (
                                        <List.Item key={iid1}>{ite1}</List.Item>
                                    ))}
                                </List>
                            </Col> : null}
                            {item.antonyms.length > 0 ? <Col>
                                <h5>Antonyms: </h5><br />
                                <List size="sm" bordered hover>
                                    {item.antonyms.map((ite1, iid1) => (
                                        <List.Item key={iid1}>{ite1}</List.Item>
                                    ))}
                                </List>
                            </Col> : null}
                        </Row>
                    </Panel>
                ))}
            </Panel>
        </div>
    );
}

export default Dictionary;