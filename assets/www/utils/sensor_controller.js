var SensorController = function (Kp, complex) {
    const STDEV = 4.3351;
    const MAX_RANGE = 20;

    this.Kp = Kp;
    this.complex = complex;
    this.last_value = 0;
    this.last_error = 0;

    this.getValue = function (new_value) {
        if (Math.abs(new_value) > 360)
            return this.last_value;

        var error = new_value - this.last_value;
        if (error > 180)
            error = error - 360;
        else if (error < (-180))
            error = error + 360;

        var K = this.Kp;
        if (this.complex) {
            if (Math.abs(error) < MAX_RANGE) {
                var calc = Math.pow(MAX_RANGE + 1 - Math.abs(error), 2);
                K = (((calc - 1) / Math.pow(2, this.last_error) + 1) / calc) * this.Kp;
                if (Math.abs(error) < STDEV)
                    this.last_error = Math.min(20, this.last_error + 1);
                else
                    this.last_error = Math.max(0, this.last_error - 1);
            } else
                this.last_error = 0;
        }

        var value = K * error;

        value += this.last_value;
        if (value > 360)
            value = value - 360;
        else if (value < 0)
            value = 360 + value;

        this.last_value = value;
        return value;
    }
}