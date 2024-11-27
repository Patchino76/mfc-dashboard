"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, AlertTriangle } from "lucide-react";
import ProcessGauge from "./ProcessGauge";
import ProcessTrend from "./ProcessTrend";

interface ProcessParameter {
  name: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  lowLimit: number;
  highLimit: number;
}

export default function ProcessOptimizer() {
  const [parameters, setParameters] = useState<ProcessParameter[]>([
    {
      name: "Temperature",
      value: 150,
      min: 100,
      max: 200,
      unit: "°C",
      lowLimit: 120,
      highLimit: 180,
    },
    {
      name: "Pressure",
      value: 2.5,
      min: 1,
      max: 5,
      unit: "bar",
      lowLimit: 1.5,
      highLimit: 3.5,
    },
    {
      name: "Flow Rate",
      value: 75,
      min: 50,
      max: 100,
      unit: "L/min",
      lowLimit: 60,
      highLimit: 90,
    },
    {
      name: "Concentration",
      value: 0.8,
      min: 0,
      max: 1,
      unit: "mol/L",
      lowLimit: 0.3,
      highLimit: 0.9,
    },
  ]);

  const [targets, setTargets] = useState({
    yield: 85,
    quality: 90,
    efficiency: 80,
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    if (isOptimizing) {
      const interval = setInterval(() => {
        setHistoricalData((prev) => [
          ...prev,
          {
            timestamp: new Date().getTime(),
            ...parameters.reduce(
              (acc, param) => ({
                ...acc,
                [param.name]: param.value + (Math.random() - 0.5) * 5,
              }),
              {}
            ),
            yield: targets.yield + (Math.random() - 0.5) * 2,
            quality: targets.quality + (Math.random() - 0.5) * 2,
            efficiency: targets.efficiency + (Math.random() - 0.5) * 2,
          },
        ]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isOptimizing, parameters, targets]);

  const handleParameterChange = (index: number, newValue: number) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = {
      ...updatedParameters[index],
      value: newValue,
    };
    setParameters(updatedParameters);
  };

  const handleLimitChange = (
    index: number,
    type: "lowLimit" | "highLimit",
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const updatedParameters = [...parameters];
    const param = updatedParameters[index];

    // Ensure limits stay within min/max bounds
    if (
      type === "lowLimit" &&
      numValue >= param.min &&
      numValue <= param.highLimit
    ) {
      param.lowLimit = numValue;
    } else if (
      type === "highLimit" &&
      numValue <= param.max &&
      numValue >= param.lowLimit
    ) {
      param.highLimit = numValue;
    }

    setParameters(updatedParameters);
  };

  const handleTargetChange = (key: keyof typeof targets, newValue: number) => {
    setTargets((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const toggleOptimization = () => {
    setIsOptimizing(!isOptimizing);
  };

  const resetOptimization = () => {
    setIsOptimizing(false);
    setHistoricalData([]);
  };

  const isValueOutOfLimits = (param: ProcessParameter) => {
    return param.value < param.lowLimit || param.value > param.highLimit;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Process Optimization Control</h1>
        <div className="space-x-4">
          <Button
            variant={isOptimizing ? "destructive" : "default"}
            onClick={toggleOptimization}
          >
            {isOptimizing ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Stop
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Start
              </>
            )}{" "}
            Optimization
          </Button>
          <Button variant="outline" onClick={resetOptimization}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Process Parameters</h2>
          <div className="space-y-6">
            {parameters.map((param, index) => (
              <div key={param.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>{param.name}</Label>
                  <div className="flex items-center gap-2">
                    {isValueOutOfLimits(param) && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {param.value.toFixed(1)} {param.unit}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-[100px_1fr_100px] gap-2 items-center">
                  <Input
                    type="number"
                    value={param.lowLimit}
                    onChange={(e) =>
                      handleLimitChange(index, "lowLimit", e.target.value)
                    }
                    className="h-8"
                    min={param.min}
                    max={param.highLimit}
                    step={(param.max - param.min) / 100}
                  />
                  <div className="relative">
                    <div
                      className="absolute w-px h-3 bg-yellow-500"
                      style={{
                        left: `${
                          ((param.lowLimit - param.min) /
                            (param.max - param.min)) *
                          100
                        }%`,
                        bottom: "8px",
                      }}
                    />
                    <div
                      className="absolute w-px h-3 bg-yellow-500"
                      style={{
                        left: `${
                          ((param.highLimit - param.min) /
                            (param.max - param.min)) *
                          100
                        }%`,
                        bottom: "8px",
                      }}
                    />
                    <Slider
                      value={[param.value]}
                      min={param.min}
                      max={param.max}
                      step={(param.max - param.min) / 100}
                      onValueChange={([value]) =>
                        handleParameterChange(index, value)
                      }
                    />
                  </div>
                  <Input
                    type="number"
                    value={param.highLimit}
                    onChange={(e) =>
                      handleLimitChange(index, "highLimit", e.target.value)
                    }
                    className="h-8"
                    min={param.lowLimit}
                    max={param.max}
                    step={(param.max - param.min) / 100}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {param.min} {param.unit}
                  </span>
                  <span>
                    {param.max} {param.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Target Objectives</h2>
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(targets).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <Label className="capitalize">{key}</Label>
                  <span className="text-sm text-muted-foreground">
                    {value.toFixed(1)}%
                  </span>
                </div>
                <Slider
                  value={[value]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([newValue]) =>
                    handleTargetChange(key as keyof typeof targets, newValue)
                  }
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Tabs defaultValue="gauges" className="w-full">
        <TabsList>
          <TabsTrigger value="gauges">Real-time Gauges</TabsTrigger>
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="gauges">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {parameters.map((param) => (
              <Card key={param.name} className="p-4 bg-white">
                <ProcessGauge
                  value={param.value}
                  min={param.min}
                  max={param.max}
                  title={param.name}
                  unit={param.unit}
                  lowLimit={param.lowLimit}
                  highLimit={param.highLimit}
                />
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="trends">
          <Card className="p-6 bg-white">
            <ProcessTrend data={historicalData} parameters={parameters} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
