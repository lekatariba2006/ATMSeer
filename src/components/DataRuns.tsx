import axios from "axios";
import ReactEcharts from "echarts-for-react";
import * as React from "react";
import {getColor, csv2json} from "../helper"
import Methods from './Methods';
import {IDataRun} from '../types';



export interface IState{
    dataruns: IDataRun[]
}
export interface IProps{
}
export default class DataRuns extends React.Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
            dataruns:[]
        }
    }
    public async getData() {
        const res = await axios.get('../../viz/datarun2_gp.csv')
        const run = res.data
        // const res = await axios.get('../../data/csvs/bandit/hyperpartitions.csv')
        // const banditData = res.data
        this.setState({dataruns: [run]})

    }
    public componentDidMount(){
        this.getData()
    }
    public render(){
        const {dataruns} = this.state
        if (dataruns.length>0){
            return <div style={{height: '100%'}}>
            <BarChart run={dataruns[0]} height={30}/>
            <Methods height={70} datarun={csv2json(dataruns[0])}/>
            </div>
        }else{
            return <div />
        }
        
    }
}

class BarChart extends React.Component<{run:any, height: number}, {}>{
    public getOption(){
        let points = this.props.run.split('\n')
        // remove the header and last row
        points.shift()
        points.splice(-1, 1)
        let data = points.map((point:any)=>{
            point = point.split(',')
            let performance = parseFloat( point[4].split("+-")[0] )
            let method = point[1]
            // let trialID = parseInt(point[0])
            return {
                value: performance,
                itemStyle: {
                     color: getColor(method)
                }
            }
        })
        const option = {
            xAxis: {
                type: 'category',
                // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                // type: 'value'
            },
            yAxis: {
                type: 'value'
            },
            grid:{
                left: '5%',
                right: '5%',
                top: '5%',
                bottom: '5%',
            },
            tooltip:{},
            series: [{
                data: data,
                type: 'bar',
                itemStyle: {
                    normal: {
                    },
                    emphasis: {
                        barBorderWidth: 1,
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowColor: 'rgba(0,0,0,0.5)'
                    }
                }
            }]
        };
        return option
    }
    public render(){
        return <ReactEcharts 
        option = { this.getOption() }
        style={{height: `${this.props.height}%`, width: '100%'}}
        />
    }
}